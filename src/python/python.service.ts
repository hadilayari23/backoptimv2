import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class PythonService {
  runPythonScript(): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = exec('python3 ./src/python/KafkaMongo.py', (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
        } else {
          console.log('Stdout:', stdout);
          console.log('Stderr:', stderr);
          resolve(stdout || stderr);
        }
      });

      process.stdout.on('data', (data) => {
        console.log('Python script stdout:', data);
      });

      process.stderr.on('data', (data) => {
        console.error('Python script stderr:', data);
      });
    });
  }
}
