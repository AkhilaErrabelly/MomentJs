import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class orderBy implements PipeTransform {

    static _orderByComparator(a:any, b:any):number{

      if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
        //Isn't a number so lowercase the string to properly compare
        if(a.toLowerCase() < b.toLowerCase()) return -1;
        if(a.toLowerCase() > b.toLowerCase()) return 1;
      }
      else{
        //Parse strings as numbers to compare properly
        if(parseFloat(a) < parseFloat(b)) return -1;
        if(parseFloat(a) > parseFloat(b)) return 1;
      }

      return 0; //equal each other
    }

    transform(input:any, [config = '+']): any{

        if(!Array.isArray(input)) return input;

        if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
            var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
            var desc = propertyToCheck.substr(0, 1) == '-';

            //Basic array
            if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
                return !desc ? input.sort() : input.sort().reverse();
            }
            else {
                var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;

                return input.sort(function(a:any,b:any){
                    return !desc
                        ? orderBy._orderByComparator(a[property], b[property])
                        : -orderBy._orderByComparator(a[property], b[property]);
                });
            }
        }
        else {
            //Loop over property of the array in order and sort
            return input.sort(function(a:any,b:any){
                for(var i:number = 0; i < config.length; i++){
                    var desc = config[i].substr(0, 1) == '-';
                    var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
                        ? config[i].substr(1)
                        : config[i];

                    var comparison = !desc
                        ? orderBy._orderByComparator(a[property], b[property])
                        : -orderBy._orderByComparator(a[property], b[property]);

                    //Don't return 0 yet in case of needing to sort by next property
                    if(comparison != 0) return comparison;
                }

                return 0; //equal each other
            });
        }
    }
}

@Pipe({
    name: 'phone'
})
export class PhonePipe{
    transform(tel, args) {
      if (!tel) { return ''; }

      var value = tel.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
          return tel;
      }

      var country, city, number;

      switch (value.length) {
          case 10: // +1PPP####### -> C (PPP) ###-####
              country = 1;
              city = value.slice(0, 3);
              number = value.slice(3);
              break;

          case 11: // +CPPP####### -> CCC (PP) ###-####
              country = value[0];
              city = value.slice(1, 4);
              number = value.slice(4);
              break;

          case 12: // +CCCPP####### -> CCC (PP) ###-####
              country = value.slice(0, 3);
              city = value.slice(3, 5);
              number = value.slice(5);
              break;

          default:
              return tel;
      }

      if (country == 1) {
          country = "";
      }

      number = number.slice(0, 3) + '-' + number.slice(3);

      return (country + " (" + city + ") " + number).trim();
    }
}
