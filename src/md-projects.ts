import { config } from "dotenv"
import { graphql } from "@octokit/graphql"
import { format, formatDistance } from "date-fns"
config()

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const {
  user: {
    repositories: { nodes },
  },
} = await graphql(
  `
    {
      user(login: "${process.argv.pop()}") {
        repositories(orderBy: { field: UPDATED_AT, direction: DESC }, first: 100, privacy: PUBLIC) {
          nodes {
            id
            url
            createdAt
            description
            homepageUrl
            isArchived
            isTemplate
            isUserConfigurationRepository
            name
            updatedAt
          }
        }
      }
    }
  `,
  {
    headers: {
      authorization: `token ${process.env.GH_ACCESS_TOKEN}`,
    },
  }
)

const heads = ["Project", "Description", "Web", "Archived", "Updated", "Since"]
console.log(`| ${heads.join(" | ")} |`)
console.log(`|${" - |".repeat(heads.length)}`)

// console.log("| Project | Description | Archived | Updated | Since |\n| - | - | ")

nodes.forEach(repo => {
  const cols = [
    `[${repo.name}](${repo.url})`,
    repo.description,
    repo.homepageUrl ? `[:link:](${repo.homepageUrl})` : "",
    repo.isArchived ? ":heavy_check_mark:" : "",
    capitalize(formatDistance(new Date(), new Date(repo.updatedAt))) + " ago",
    format(new Date(repo.createdAt), "Y"),
  ]
  console.log(`| ${cols.join(" | ")} |`)
})
console.log("> :hourglass: " + new Date())
