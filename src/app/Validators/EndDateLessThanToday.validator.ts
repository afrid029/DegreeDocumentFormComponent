import { AbstractControl, ValidationErrors } from "@angular/forms";

export function EndDateLessThanToday(control : AbstractControl) : ValidationErrors | null {
    const date = control.value;
    if(date){
        let inputDate =  date;
        if(typeof(date) == 'string'){
            const formatedDate = date.split('-')
            inputDate = new Date(parseInt(formatedDate[2]), parseInt(formatedDate[1])-1, parseInt(formatedDate[0]))
        }

        const today = new Date();
        if((today.getTime() - inputDate.getTime()) < 0) {
            return ({
                EndDateLessThanToday : "End date should not be greater than today"
            })
        }
    }
    return null;
}