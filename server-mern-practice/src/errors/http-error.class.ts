export class HTTPError extends Error {
	// мы расширяем обычную ошибку свойствами statusCode и context
	statusCode:number
	context?:string
	//message уже есть в дефолтном Error, поэтому нам не надо его повторно объявлять 
	constructor(statusCode:number, message: string, context?:string) {
		super(message)
		this.statusCode = statusCode
		this.context = context
		this.message = message
	}
}