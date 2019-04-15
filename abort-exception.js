"use module"

const
  nativeAbortException= typeof AbortException!== "undefined"&& AbortException,
  domException= typeof DOMException!== "undefined",
  origBaseError= domException? DOMException: Error
let baseError= origBaseError

function wrapError( err){
	if( err=== true|| err=== false|| err=== null){
		return undefined
	}
	if( err instanceof Error){
		return "AbortException wrapping: " + (err.message|| "")
	}
	return err
}

export function generateAbortException( baseErrorClass= baseError){
	if( nativeAbortException){
		return nativeAbortException
	}
	const abortException= (function(){
		// we use the IIFE so this class-expression can implicitly get the desired `name`.
		const AbortException= class extends baseErrorClass{
			constructor( err){
				super( wrapError( err))
				if( err instanceof Error){
					this.wrappedError= err
				}
			}
		}
		return AbortException
	})()
	return abortException
}

export function setAbortException( newAbortException, doForce){
	const origAbortException= abortException
	if( !doForce&& nativeAbortException){
		throw new Error("Already have a native AbortException")
	}
	abortException= newAbortException
	return origAbortException
}

export function setBaseError( newBaseError= origBaseError){
	if( newBaseError=== false){
		newBaseError= undefined
	}
	if( newBaseError=== baseError){
		return abortException
	}
	const generated= generateAbortException( newBaseError)
	setAbortException( generated)
	return generated
}

let abortException= generateAbortException()
export {
  abortException as AbortException,
  abortException as default
}
