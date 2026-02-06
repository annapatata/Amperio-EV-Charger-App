import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);

// Helper function to run the CLI command
const runCli = (command) => {
  const cliPath = './index.js'; // Path to the CLI entry point
  return execPromise(`node ${cliPath} ${command}`, { env: process.env });
};

describe('CLI Commands', () => {

  // Before each test, reset the database to a known state.
  beforeEach(async () => {
    const { stdout, stderr } = await runCli('resetpoints');
    expect(stderr).toBe('');
    expect(stdout).toContain('Data reset to initial state successfully.');
  });

  // --- se2519 points ---
  describe('points command', () => {
    it('should return a list of all points in CSV format', async () => {
      const { stdout, stderr } = await runCli('points'); // No status filter
      expect(stderr).toBe('');
      // Check for CSV header and a known point from reset_data.json
      expect(stdout).toContain('providerName,pointid,lon,lat,status,cap');
      expect(stdout).toContain('4704813'); // This should always be present now
    });

    it('should return a list of points filtered by status in CSV format', async () => {
      const { stdout, stderr } = await runCli('points --status available');
      expect(stderr).toBe('');
      // Check for CSV header
      expect(stdout).toContain('providerName,pointid,lon,lat,status,cap');
      
      const lines = stdout.trim().split('\n');
      const header = lines.shift(); // Remove header line
      expect(lines.length).toBeGreaterThan(0); // Ensure there are data rows

      // Verify each row has the correct status
      lines.forEach(line => {
        const columns = line.split(',');
        const statusColumnIndex = header.split(',').indexOf('status');
        expect(columns[statusColumnIndex]).toBe('available');
      });
    });

    it('should return a list of points in JSON format when requested', async () => {
        const { stdout, stderr } = await runCli('points --format json');
        expect(stderr).toBe('');
        const data = JSON.parse(stdout);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        // Check for a known point from reset_data.json
        const point = data.find(p => p.pointid === 4704813);
        expect(point).toBeDefined();
    });
  });

  // --- se2519 point --id <id> ---
  describe('point command', () => {
    it('should return details for a specific point', async () => {
        const pointId = 4704813; // Charger ID from first record in reset_data.json
        const { stdout, stderr } = await runCli(`point --id ${pointId}`);
        expect(stderr).toBe('');
        // Check for properties as substrings since console.log(object) is not valid JSON
        expect(stdout).toContain(`pointid: ${pointId}`);
    });

    it('should return an error for a non-existent point', async () => {
        const { stdout, stderr } = await runCli('point --id 9999999');
        expect(stdout).toBe('');
        
        // Stderr should now contain the JSON error object from the server
        const errorResponse = JSON.parse(stderr);
        
        expect(errorResponse.call).toBe('/api/point/9999999');
        expect(errorResponse.return_code).toBe(404);
        expect(errorResponse.error).toBe('Point with ID 9999999 not found');
    });
  });

  // --- se2519 addpoints --source <file> ---
  describe('addpoints command', () => {
    const testCsvPath = path.join(__dirname, 'temp_points.csv');

    afterAll(async () => {
      // Clean up the temporary file after all tests in this suite are done
      try {
        await fs.unlink(testCsvPath);
      } catch (error) {
        // Ignore errors if the file doesn't exist
      }
    });

    it('should add points from a valid CSV file', async () => {
      const csvContent = 'id,name,address,latitude,longitude,outlet_id\n999,Test Add Station,456 Test Ave,38,-24,99901';
      await fs.writeFile(testCsvPath, csvContent);
      
      const { stdout, stderr } = await runCli(`addpoints --source ${testCsvPath}`);
      expect(stderr).toBe('');
      expect(stdout).toContain('Upload successful');
      expect(stdout).toContain('Successfully imported 1 stations.');

      // Verify the point was actually added
      const { stdout: pointOut, stderr: pointErr } = await runCli('point --id 99901');
        expect(pointErr).toBe('');
        expect(pointOut).toContain('pointid: 99901');
    });
  });
});
