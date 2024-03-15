

// const asyncHandler = ()=> async (err,req,res,next)=>{
//     try{
//         await fun(err,req,res,next)
//     }catch(error){
//         res.status(res.error || 500).json({
//             sucess: false,
//             message: error.message
//         })
//     }
// }



// second way of doing this is 

const asyncHandler = (funHandler) => {
   return (req,res,next)=>{
        Promise.resolve(funHandler(req,res,next))
        .catch((err) => next(err))
    }
}
export {asyncHandler}

