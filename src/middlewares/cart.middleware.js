module.exports = (req,res,next)=>{

   
try {
    let nitems = req.body.items.map((el)=>{
        // console.log(el)
        return {product_id:el._id,quantity:el.quantity,size:el.size}
    })
    // console.log(nitems)
    req.body.items = nitems;
    next();
} catch (error) {
    res.status(500).send("something went wrong")
}
}