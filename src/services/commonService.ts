export default class commonService {

    public isDateValid(date: any) {
        const updatedDate: any = new Date(date);
        return date instanceof Date && !isNaN(updatedDate);
    }
}