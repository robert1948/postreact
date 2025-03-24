# Navigate to your project root directory
cd /media/robert/Linux012/postreact

# First, remove all Git-related files and directories
rm -rf .git
rm -rf client/.git
rm -rf server/.git
rm -f .gitmodules

# Initialize a new Git repository
git init

# Ensure the directories are not treated as submodules
git config -f .git/config --remove-section submodule.client 2>/dev/null || true
git config -f .git/config --remove-section submodule.server 2>/dev/null || true

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"
