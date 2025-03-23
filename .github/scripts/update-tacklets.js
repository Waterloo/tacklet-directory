const fs = require('fs');
const path = require('path');

// Function to read all files from a directory recursively
function readFilesFromDirectory(directory) {
  const results = [];
  
  // Read all files in the directory
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      // If it's a directory, recursively read files from it
      const subdirectoryFiles = readFilesFromDirectory(filePath);
      results.push(...subdirectoryFiles);
    } else {
      // If it's a file, read its content
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let data;
        
        // Try to parse if it's a JSON file
        if (path.extname(file.name).toLowerCase() === '.json') {
          try {
            data = JSON.parse(fileContent);
          } catch (parseError) {
            console.error(`Error parsing JSON from ${filePath}: ${parseError.message}`);
            data = { content: fileContent, error: "Failed to parse as JSON" };
          }
        } else {
          // For non-JSON files, just store the content
          data = { content: fileContent };
        }
        
        // Add file metadata
        results.push({
          name: file.name,
          path: filePath,
          data: data
        });
      } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
      }
    }
  }
  
  return results;
}

// Main function
function main() {
  const tackletsDir = 'tacklets';
  const outputFile = 'directory/tacklets.json';
  
  console.log(`Reading files from ${tackletsDir}...`);
  
  // Check if tacklets directory exists
  if (!fs.existsSync(tackletsDir)) {
    console.error(`Directory ${tackletsDir} does not exist.`);
    return;
  }
  
  // Read all files from the tacklets directory
  const tacklets = readFilesFromDirectory(tackletsDir);
  
  console.log(`Found ${tacklets.length} tacklets.`);
  
  // Write the data to the output file
  fs.writeFileSync(outputFile, JSON.stringify(tacklets, null, 2));
  
  console.log(`Successfully wrote data to ${outputFile}.`);
}

// Run the main function
main();
