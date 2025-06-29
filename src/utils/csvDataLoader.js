/**
 * Fetches and parses CSV data from a file
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Promise that resolves to an array of objects
 */
export const fetchCsvData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCsv(csvText);
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
};

/**
 * Parses CSV text into an array of objects
 * @param {string} csvText - CSV text content
 * @returns {Array} - Array of objects representing CSV rows
 */
const parseCsv = (csvText) => {
  // Split the CSV text into lines
  const lines = csvText.split('\n');
  
  // Extract headers from the first line
  const headers = lines[0].split(',').map(header => 
    // Remove quotes if present
    header.replace(/^"(.*)"$/, '$1')
  );
  
  // Process each data row
  return lines.slice(1)
    .filter(line => line.trim() !== '') // Skip empty lines
    .map(line => {
      const values = parseCSVLine(line);
      
      // Create an object mapping headers to values
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index];
        
        // Handle numeric values
        if (/^\d+$/.test(value)) {
          value = parseInt(value, 10);
        } else if (/^\d+\.\d+$/.test(value)) {
          value = parseFloat(value);
        } 
        // Handle arrays (comma-separated values within quotes)
        else if ((header === 'suitableFor' || header === 'risk') && value) {
          // Clean up array format by removing square brackets and single quotes
          value = value.replace(/^\['|'\]$|'\s*,\s*'/g, '')  // Remove ['...'] format
                       .replace(/\[|\]|'|"/g, '')           // Remove any remaining brackets or quotes
                       .split(',')
                       .map(item => item.trim())
                       .filter(item => item !== '');
        }
        
        row[header] = value;
      });
      
      return row;
    });
};

/**
 * Parse a CSV line, handling quoted values that may contain commas
 * @param {string} line - A single line from CSV
 * @returns {Array} - Array of values
 */
const parseCSVLine = (line) => {
  const values = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.replace(/^"(.*)"$/, '$1').trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  if (currentValue) {
    values.push(currentValue.replace(/^"(.*)"$/, '$1').trim());
  }
  
  return values;
};

/**
 * Loads insurance products from CSV
 * @returns {Promise<Array>} - Promise that resolves to an array of insurance products
 */
export const loadInsuranceProducts = async () => {
  try {
    const products = await fetchCsvData('/data/insurance_products.csv');
    return products;
  } catch (error) {
    console.error('Error loading insurance products:', error);
    return [];
  }
}; 