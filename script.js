function navbarToggle() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}

const apiKey = 'z4XZ6gQldbvXfKXITMji9QGO54QU1GAzMLWQRAK5'; 
const apiUrl = 'https://api.cohere.ai/v1/generate'; 

async function generateTitle() {
    const blogContent = document.getElementById("blogContent").value;

    if (!blogContent.trim()) {
        alert("Please enter blog content to generate a title.");
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
        dropdown.innerHTML = `<option value="" disabled selected>Select a title..</option>`;

        if (data.generations && data.generations.length > 0) {       
            data.generations.forEach((gen, idx) => {
                const generatedTitle = gen.text.trim();
                const optionElement = document.createElement("option");
                optionElement.value = generatedTitle;
                optionElement.textContent = `${idx + 1}. ${generatedTitle}`;
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
        dropdown.innerHTML = `<option value="" disabled selected>Error, Please try again.</option>`;
    }
}

function savelocalStorage(){
    localStorage.setItem("blogs", JSON.stringify(blogs));
}

function loadlocalStorage() {
    const storedBlg = localStorage.getItem("blogs");
    if (storedBlg){
        blogs.length = 0;
        blogs.push(...JSON.parse(storedBlg));
        showBlogs();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadlocalStorage();
});

const blogs = [];

function saveBlog() {
    const selectedTitle = document.getElementById("generatedTitle").value;
    const blogContent = document.getElementById("blogContent").value;
    if (!selectedTitle){
        alert("please select a title");
        return;
    }

    if (!blogContent){
        alert("please enter blog content");
        return;
    }

    const newblog = {
        title: selectedTitle,
        content: blogContent
    }
    blogs.push(newblog);

    savelocalStorage();

    document.getElementById("blogContent").value = "";
    document.getElementById("generatedTitle").selectedIdx = 0;

    showBlogs();
    alert("your blog has been saved");
}

function showBlogs() {
    const blogContainer = document.getElementById("savedBlogs");
    blogContainer.innerHTML = "";

    blogs.forEach((blog, idx) => {
        const blogcard = document.createElement("div");
        blogcard.className = "blog-card";
        blogcard.innerHML = `<h4>${blog.title}</h4>
        <p>${blog.content.slice(0, 50)}..</p>`;

        blogContainer.appendChild(blogcard);
    });
}

function deleteBlog(idx){
    blogs.splice(idx, 1);

    savelocalStorage();
    showBlogs();

    alert("Blog deleted");
}

function editBlog(idx) {
    const blog = blogs[idx];

    document.getElementById("blogContent").value = blog.content;
    const titledropdown = document.getElementById("generatedTitle");
    let options = document.createElement("option");
    options.value = blog.title;
    options.textContent = blog.title;
    options.selected = true;
    titledropdown.appendChild(options);

    const saveButton = document.querySelector("button[onclick='saveBlogs()']");
    saveButton.textContent = "Update Blog";
    saveButton.onclick = function () {
        updateBlog(idx);
    };
}

function updateBlog(idx) {
    const updatedTitle = document.getElementById("generatedTitle").value;
    const updatedContent = document.getElementById("blogContent").value;

    if (!updatedTitle) {
        alert("Please select title");
        return;
    }
    if (!updatedContent.trim()) {
        alert("Please write your blog");
        return;
    }

    blogs[idx] = {
        title: updatedTitle,
        content: updatedContent
    }

    savelocalStorage();

    document.getElementById("blogContent").value = "";
    document.getElementById("generatedTitle").selectedIdx = 0;

    showBlogs();

    const saveButton = document.querySelector("button[onclick='saveBlog()']");
    saveButton.textContent = "save Blog";
    saveButton.onclick = saveBlog;

    alert("your blog updated");
}

function showFullBlog(blog, index) {
    const blogContainer = document.getElementById("savedBlogs");
    blogContainer.innerHTML = `
        <div class="blog-item">
            <h4>${blog.title}</h4>
            <p>${blog.content}</p>
            <button onclick="showBlogs()">Back to All Blogs</button>
            <button onclick="editBlog(${index})">Edit</button>
            <button onclick="deleteBlog(${index})">Delete</button>
        </div>
    `;
}