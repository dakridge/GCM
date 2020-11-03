export const createSpaces = (count:number) => {
    return Array.from({ length: count }).map(() => '').join(' ');
}

export const readJson = async (path:string) =>{
    try {
        const file = await Deno.readTextFile(path);
        const json = JSON.parse(file);

        return json;
    }
    catch(ermahgerd) {
        throw(ermahgerd) ;
    }
}