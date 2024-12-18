const apiKey = 'z4XZ6gQldbvXfKXITMji9QGO54QU1GAzMLWQRAK5'; 
const apiUrl = 'https://api.cohere.ai/v1/generate'; 

async function generateTitle() {
    const blogContent = document.getElementById("blogContent").value;

    
    if (!blogContent.trim()) {
        alert("Please enter some blog content to generate a title.");
        return;
    }

   
    const requestData = {
        model: "command", 
        prompt: `provide title for following blog without any extra massages:\n\n${blogContent}`,
        max_tokens: 10,
        temperature: 0.7,
        num_generations: 3 
    };

    try {
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        
        const data = await response.json();

        const dropdown = document.getElementById("generatedTitle");
        dropdown.innerHTML = `<option value="" disabled selected>Select a title...</option>`;

        if (data.generations && data.generations.length > 0) {
            
            data.generations.forEach((gen, index) => {
                const generatedTitle = gen.text.trim();
                const optionElement = document.createElement("option");
                optionElement.value = generatedTitle;
                optionElement.textContent = `${index + 1}. ${generatedTitle}`;
                dropdown.appendChild(optionElement);
            });
        } else {
            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Title generation failed. Please try again.";
            defaultOption.disabled = true;
            dropdown.appendChild(defaultOption);
        }
    } catch (error) {
        console.error("Error:", error);

        const dropdown = document.getElementById("generatedTitle");
        dropdown.innerHTML = `<option value="" disabled selected>An error occurred. Please try again.</option>`;
    }
}