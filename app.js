//document.body.onload = addElement;

async function import_graphml_file() {
    let input = document.createElement('input');
    const new_div = document.createElement("div");

    input.type = 'file';
    input.onchange = _ => handle_file_input(input, new_div);
    input.click();
}

async function handle_file_input(input, new_div) {
    // you can use this method to get file and perform respective operations
    let files = Array.from(input.files);
    console.log(files);
    console.log(files[0].type);
    const load_confirmation = document.createTextNode("Load File: " + files[0].name);
    new_div.appendChild(load_confirmation);
    //const current_div = document.getElementById("div1");
    document.body.appendChild(new_div)

    try {
        const file_content = await load_txt_file(files[0]);
        console.log(file_content)
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(file_content),
        })
            .then(response => response.json()) // Assuming the server responds with JSON
            .then(data => {
                console.log('Response from server:', data);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }
    catch (error) {
        console.error(error);
    }

    /*
    file_content_promise
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            console.log("File read")
        })
    */
}


async function load_txt_file(file) {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
            //console.log(reader.result);
        }
        reader.onerror = () => {
            reject(reader.error);

        };
        reader.readAsText(file);
    })

    /*
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        console.log(reader.result);
    };
    
    reader.onerror = function() {
        console.log(reader.error);
    };
    return reader
    */

}
/*
function load_button(){
    alert("This is supposed to load a file")
} 
*/
