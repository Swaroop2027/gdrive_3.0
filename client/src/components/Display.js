import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value; //fetch user input address if any
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress); //returns array related to input address
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account); //else fetching from connected account
      }
    } catch (e) {
      alert("You don't have access");
    }
    const isEmpty = Object.keys(dataArray).length === 0; //checking if caller address has no data

    if (!isEmpty) {
      const str = dataArray.toString(); //converting in string form from object form
      const str_array = str.split(","); //splitting image links by comma in an array
      // console.log(str);
      // console.log(str_array);
      const images = str_array.map((item, i) => {
        return (
          <a href={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`} key={i} target="_blank">
            <img
              key={i}
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt="New image"
              className="image-list"
            ></img>
          </a>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };
  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};
export default Display;