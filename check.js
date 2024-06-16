import axios from "axios";

const checkKey = async function (chaveKey) {
  console.log("blockchain", chaveKey);

  const attachment = await axios
    .get(`https://blockchain.info/rawaddr/${chaveKey}`, {})
    .then(async (response) => {
      // console.log(response.data);
      // console.log("total_received", response.data.total_received);
      console.log("final_balance", response.data.final_balance);
    })
    .catch(function (error) {
      console.log(error);
    });
};

let chaveKey = "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH";

await checkKey(chaveKey);
