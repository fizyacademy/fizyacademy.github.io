import fs from 'fs';
import path from 'path';

// List of directories to exclude
const excludeDirs = ['node_modules', '.git', 'venv', '__pycache__'];

// Function to recursively traverse directories and create a tree structure
const getDirectoryTree = (dirPath, level = 0) => {
  const items = fs.readdirSync(dirPath);
  const directories = [];
  const files = [];
  
  // Split directories and files
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Exclude the folder if it's in the excludeDirs list
      if (!excludeDirs.includes(item)) {
        directories.push(item); // Add directories to the directories list
      }
    } else {
      files.push(item); // Add files to the files list
    }
  });

  let tree = '';
  const indentation = '  '.repeat(level); // Indentation for nested directories

  // First add the directories
  directories.forEach((item, index) => {
    const isLastItem = index === directories.length - 1;
    tree += `${indentation}${isLastItem ? '└──' : '├──'} ${item}\n`;
    tree += getDirectoryTree(path.join(dirPath, item), level + 1); // Recurse into subdirectories
  });

  // Then add the files
  files.forEach((item, index) => {
    const isLastItem = index === files.length - 1;
    tree += `${indentation}${isLastItem ? '└──' : '├──'} ${item}\n`;
  });

  return tree;
};

// Get the name of the project (current folder name)
const projectName = path.basename(path.resolve('.')); // Get the folder name of the current directory

// Start from the root directory
const projectRoot = path.resolve('.'); // Current directory
const tree = getDirectoryTree(projectRoot);

// Write the tree structure to a Markdown file, with the project name as the title
fs.writeFileSync('project-structure.md', `${projectName} /\n${tree}`);

console.log(`Project structure exported to project-structure.md for ${projectName}`);
