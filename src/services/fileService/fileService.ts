import fs from 'fs';
import { parseData } from '../../utils/helper';

export const readFile = (filePath: string) => {
        let fileData = fs.readFileSync(filePath, 'utf8');
        return parseData(fileData);
}

export const writeFile = (filePath: string, data: any) => {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}