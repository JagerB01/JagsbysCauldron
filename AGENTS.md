# Cauldron release instructions

When a task creates a new version of Cauldron, publish the tested
`downloads/Jagsbys_Cauldron_v<version>.mcaddon` to `JagerB01/JagsbysCauldron`
on GitHub. This is a standing instruction from the repository owner. Include
publication in the same task as the version bump.

1. Run the relevant tests and confirm the archive matches the version being
   published.
2. Push the build and its corresponding source to GitHub. Use an existing
   release workflow when available. If GitHub Releases is unavailable, push a
   dedicated `download/cauldron-v<version>` branch.
3. Confirm that the pushed commit contains the exact versioned archive.
   Fetch the raw bytes and compare them with the tested local archive when
   the environment can access the raw endpoint.
4. In the final reply, give the user the **github.com file page** for the
   exact published version, pinned to the full commit SHA:
   `https://github.com/JagerB01/JagsbysCauldron/blob/<commit-sha>/downloads/Jagsbys_Cauldron_v<version>.mcaddon`.
   Label the link with the exact version and tell the user to click
   **Download raw file** on that page.

The user downloads while signed in to GitHub. A `raw.githubusercontent.com`
URL can return 404 for them even when it works from the build environment.
Use raw URLs for verification and share one only if the user requests it.
The link in the release reply must open the specific `.mcaddon` file page.
A repository homepage, branch listing, downloads folder, or local workspace
path does not satisfy the request.

If publication or verification is blocked, describe the specific blocker
and state which steps succeeded. If the signed-in file page cannot be tested
from the environment, report the remote Git and artifact checks you completed.
