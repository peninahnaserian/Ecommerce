import './AddProduct.css'
import {useState} from 'react'
import upload_area from '../../assets/admin_assets/upload_area.svg'

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name:"",
        image:"",
        category: "",
        old_price: "",
        new_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const addProduct = async() => {
        try{
            let product = productDetails
    
            let formData = new FormData();
            formData.append('product',image)
    
            const resp = await fetch('http://localhost:4000/upload',{
                method:'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            })
            const responseData = await resp.json()
            
    
            if(responseData.success){
                product.image = responseData.image_url
                console.log(product);

                const resp = await fetch('http://localhost:4000/addproduct',{
                    method:'POST',
                    headers:{
                        Accept:'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(product)
                })
                const data = await resp.json()
                console.log(data);
                
                data.success ? alert("Product Addded") : alert("Failed")
            }
        } catch(error){
            console.error(error.message);
        }
    }


    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input type="text" value={productDetails.name} onChange={changeHandler} name='name' aria-placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input type="text" value={productDetails.old_price} onChange={changeHandler} name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input type="text" value={productDetails.new_price} onChange={changeHandler} name='new_price' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select name="category" value={productDetails.category} onChange={changeHandler} className='addproduct-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={addProduct} className='addproduct-btn'>Add</button>
        </div>
    )
}

export default AddProduct