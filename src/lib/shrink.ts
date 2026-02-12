// Helper function to shrink long strings

// Example:
// shrinkString("This is a long string", 10) => "This is a..."

export function shrinkString(s: string, len: number): string {
    if(s.length > len){
        return s.substring(0, len) + "...";
    }
    return s;
}