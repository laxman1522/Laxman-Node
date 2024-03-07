import fs from 'fs';

export const readFile = (filePath: string) => {
        let fileData = fs.readFileSync(filePath, 'utf8');
        return fileData;
}

export const writeFile = (filePath: string, data: any) => {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}