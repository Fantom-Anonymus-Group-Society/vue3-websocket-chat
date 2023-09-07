export function arrayRemove(array, element){
    return array.filter(elem => {
        if(element.id != elem.id){
            return elem
        }
    })
}