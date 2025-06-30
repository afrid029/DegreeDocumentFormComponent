import { AbstractControl, ValidationErrors } from "@angular/forms";

export function AwardedDateWithEndDateValidator(control : AbstractControl) : ValidationErrors | null {
    
    const parent = control.parent;
    const awardDate = control.value;
    const endDate = parent?.get('enddate')?.value;

    if(awardDate && endDate){
        let inputAwardDate = awardDate;
        let inputEndDate = endDate;

        if(typeof(awardDate) == 'string') {
            const formatedDate = awardDate.split('-')
            inputAwardDate = new Date(parseInt(formatedDate[2]), parseInt(formatedDate[1])-1, parseInt(formatedDate[0]))
        
        }
        if(typeof(endDate) == 'string') {
            const formatedDate = endDate.split('-')
            inputEndDate = new Date(parseInt(formatedDate[2]), parseInt(formatedDate[1])-1, parseInt(formatedDate[0]))
        }

        const diffInMs = inputAwardDate.getTime() - inputEndDate.getTime()
        if(diffInMs < 0) {
            return ({
                AwardedDateWithEndDateValidator : 'Date of Awarded cannot be less than End Date'
            })
        }


    }
    
    return null;
}