import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import crypto from "crypto"; // Import the crypto module
import Resume from "../models/resumeDatamodel.js";
import User from "../models/usermodel.js";
import { fileURLToPath } from "url";
import { sendInstantEmail } from "./mailFunctionality.js";
const { GITHUB_TOKEN, GITHUB_USERNAME, VERCEL_TOKEN } = process.env;

// Initialize Octokit for GitHub API calls
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Helper to get the correct directory path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create a short, unique repository name
function generateRepoName(resumeId) {
  const hash = crypto
    .createHash("sha256")
    .update(resumeId)
    .digest("hex")
    .slice(0, 12);
  const timestamp = Date.now().toString(36).slice(-7);
  const random = crypto.randomBytes(2).toString("hex").slice(0, 3);
  return `portfolio-${hash}-${timestamp}-${random}`;
}

// Helper function to commit a file to GitHub
async function commitFile(owner, repo, filePath, content, sha) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `feat: Update portfolio data`,
    content: Buffer.from(content).toString("base64"),
    ...(sha && { sha }),
  });
}

export const handleDeploy = async (req, res) => {
  const { id } = req.params;
  // Assuming your auth middleware adds user info to req.user
  const userEmail = req.email;
  const { resumeData } = req.body;

  if (!resumeData) {
    return res.status(400).json({ message: "resumeData is required." });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const resume = await Resume.findOne({ id });
    if (userEmail != resume.owner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to deploy this resume." });
    }

    // Generate a short, unique repo name to avoid Vercel truncation.
    const repoName = generateRepoName(id);
    const deploymentInfo = resume.deployment;

    // --- Generate Script Content ---
    const templatePath = path.join(
      __dirname,
      "../portfolio-template/script-template.js"
    );
    const scriptTemplate = await fs.readFile(templatePath, "utf-8");
    const finalScript = scriptTemplate.replace(
      "__RESUME_DATA__",
      JSON.stringify(resumeData, null, 2)
    );

    if (deploymentInfo && deploymentInfo.githubRepo) {
      // --- UPDATE EXISTING REPO ---
      // Note: When updating, we need to find the repo by its stored name, not a new generated one.
      const existingRepoName = deploymentInfo.githubRepo;

      const { data: fileData } = await octokit.repos.getContent({
        owner: GITHUB_USERNAME,
        repo: existingRepoName,
        path: "script.js",
      });
      await commitFile(
        GITHUB_USERNAME,
        existingRepoName,
        "script.js",
        finalScript,
        fileData.sha
      );

      return res.json({
        message: "Update pushed to GitHub. Vercel deployment triggered.",
        url: deploymentInfo.vercelUrl,
      });
    } else {
      // --- CREATE NEW REPO AND DEPLOY ---
      const { data: createdRepo } =
        await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          private: true,
        });

      const repoId = createdRepo.id;

      const htmlContent = await fs.readFile(
        path.join(__dirname, "../portfolio-template/index.html"),
        "utf-8"
      );
      const cssContent = await fs.readFile(
        path.join(__dirname, "../portfolio-template/styles.css"),
        "utf-8"
      );

      await commitFile(GITHUB_USERNAME, repoName, "index.html", htmlContent);
      await commitFile(GITHUB_USERNAME, repoName, "styles.css", cssContent);
      await commitFile(GITHUB_USERNAME, repoName, "script.js", finalScript);

      const projectResponse = await fetch(
        "https://api.vercel.com/v9/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VERCEL_TOKEN}`,
          },
          body: JSON.stringify({
            name: repoName,
            gitRepository: {
              type: "github",
              repo: `${GITHUB_USERNAME}/${repoName}`,
            },
          }),
        }
      );

      const projectData = await projectResponse.json();
      if (projectData.error) {
        throw new Error(
          `Vercel project creation failed: ${projectData.error.message}`
        );
      }

      // Trigger a new deployment to get the URL.
      const deploymentResponse = await fetch(
        "https://api.vercel.com/v13/deployments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VERCEL_TOKEN}`,
          },
          body: JSON.stringify({
            name: repoName,
            gitSource: {
              type: "github",
              ref: "main",
              repoId: repoId,
            },
            projectSettings: {
              framework: null, // Indicates a static site with no build step.
            },
            target: "production",
          }),
        }
      );

      const deploymentData = await deploymentResponse.json();
      if (deploymentData.error) {
        throw new Error(
          `Vercel deployment trigger failed: ${deploymentData.error.message}`
        );
      }

      // CORRECT and MOST RELIABLE: Construct the permanent URL from the repo name.
      const vercelUrl = `https://${repoName}.vercel.app`;

      // Save the permanent URL to your database
      resume.deployment = { githubRepo: repoName, vercelUrl: vercelUrl };
      await resume.save();
      let result = await sendInstantEmail(
        userEmail,
        "Portfolio Website hosted",
        `Hello ${user.name}, your portfolio website is deployed on the link: ${vercelUrl}. Please do check it. 
        Thank you.`
      );
      if (!result.success) {
        res
          .status(500)
          .json({ message: "Failed to send email", error: result.error });
      }
      // Return the successful response with the permanent URL
      return res.json({
        message: "New portfolio created and deployed successfully!",
        url: vercelUrl,
      });
    }
  } catch (error) {
    console.error("Deployment failed:", error);
    return res.status(500).json({
      message: "Something went wrong during deployment.",
      error: error.message,
    });
  }
};
