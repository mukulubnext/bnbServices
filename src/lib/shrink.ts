export function shrinkString(s: string, len: number): string {
    if(s.length > len){
        return s.substring(0, len) + "...";
    }
    return s;
}