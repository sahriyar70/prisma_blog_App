type IOptions = {
    page? : number | string,
    limit?: number |string,
    sortOrder ?: string,
    sortBy?: string

}

type IOptionsResult= {
    page : number,
    limit : number,
    skip : number,
    sortBy : string,
    sortOrder : string
}

const pagenationSortingHelpars = (Options : IOptions) : IOptionsResult=>{
const page :number = Number(Options.page) || 1
const limit : number = Number(Options.limit) || 5
const skip = (page - 1)*limit
const sortBy:string = Options.sortBy || 'createdAt'
const sortOrder:string = Options.sortOrder || 'desc';

return{
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}
}


export default pagenationSortingHelpars;