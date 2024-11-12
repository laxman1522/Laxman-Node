import fs from 'fs';
import { parseData } from '../../utils/helper';

/**
 * Responsible for reading the file
 * @param filePath 
 * @returns 
 */
export const readFile = async (filePath: string) => {
        let fileData = fs.readFileSync(filePath, 'utf8');
        return parseData(fileData);
}

/**
 * Responsible for writing the file
 * @param filePath 
 * @param data 
 */
export const writeFile = (filePath: string, data: any) => {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}