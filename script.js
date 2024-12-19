function toggleNavbar() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}

const apiKey = 'z4XZ6gQldbvXfKXITMji9QGO54QU1GAzMLWQRAK5'; 
const apiUrl = 'https://api.cohere.ai/v1/generate'; 

async function generateTitle() {
    const blogContent = document.getElementById("blogContent").value;

    if (!blogContent.trim()) {
        alert("Please enter blog content.");
        return;
    }

    const requestData = {
        model: "command", 
        prompt: `don't give extra massages, generate only title:\n\n${blogContent}`,
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

function saveLocalStorage() {
    localStorage.setItem("blogs", JSON.stringify(blogs)); 
}

function loadLocalStorage() {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
        blogs.length = 0; 
        blogs.push(...JSON.parse(storedBlogs)); 
        showBlogs(); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadLocalStorage(); 
});

const blogs = [];

function saveBlog() {
    const selectedTitle = document.getElementById("generatedTitle").value;
    const blogContent = document.getElementById("blogContent").value;
    const blogImage = document.getElementById("blogImage").value;
    if (!selectedTitle) {
        alert("Please select title");
        return;
    }

    if (!blogContent.trim()) {
        alert("Please enter blog content.");
        return;
    }

    if (!blogImage.trim()) {
        alert("Please enter image URL.");
        return;
    }

    const newBlog = {
        title: selectedTitle,
        content: blogContent,
        image: blogImage
    };
    blogs.push(newBlog);

    saveLocalStorage();

    document.getElementById("blogContent").value = "";
    document.getElementById("generatedTitle").selectedIndex = 0;
    document.getElementById("blogImage").value = "";

    showBlogs();
    alert("Your blog has been saved");
}


function showBlogs() {
    const savedBlogsContainer = document.getElementById("savedBlogs");
    savedBlogsContainer.innerHTML = ""; 

    blogs.forEach((blog, index) => {
        const blogCard = document.createElement("div");
        blogCard.className = "blog-card";
        blogCard.innerHTML = `
            <img src="${blog.image}" alt="Blog Image" class="blog-image" />
            <h4>${blog.title}</h4>
            <p>${blog.content.slice(0, 50)}...</p>
        `;

        blogCard.onclick = function () {
            showFullBlog(blog, index);
        };

        savedBlogsContainer.appendChild(blogCard);
    });
}

function deleteBlog(index) {
    blogs.splice(index, 1);

    saveLocalStorage();
    showBlogs();

    alert("Blog deleted successfully!");
}

function editBlog(index) {
    const blog = blogs[index]; 
    document.getElementById("blogContent").value = blog.content;

    const titleDropdown = document.getElementById("generatedTitle");
    let tempOption = document.createElement("option");
    tempOption.value = blog.title;
    tempOption.textContent = blog.title;
    tempOption.selected = true;
    titleDropdown.appendChild(tempOption);

    const saveButton = document.querySelector("button[onclick='saveBlog()']");
    saveButton.textContent = "Update Blog";
    saveButton.onclick = function () {
        updateBlog(index); 
    };
}


function updateBlog(index) {
    const updatedTitle = document.getElementById("generatedTitle").value;
    const updatedContent = document.getElementById("blogContent").value;
    const updatedImage = document.getElementById("blogImage").value;

    if (!updatedTitle) {
        alert("Please select a title.");
        return;
    }
    if (!updatedContent.trim()) {
        alert("Please enter blog content.");
        return;
    }

    if (!updatedImage.trim()) {
        alert("Please enter image URL.");
        return;
    }

    blogs[index] = {
        title: updatedTitle,
        content: updatedContent,
        image: updatedImage
    };

    saveLocalStorage();

    document.getElementById("blogContent").value = "";
    document.getElementById("generatedTitle").selectedIndex = 0;
    document.getElementById("blogImage").value = "";

    showBlogs();

    const saveButton = document.querySelector("button[onclick='saveBlog()']");
    saveButton.textContent = "Save Blog";
    saveButton.onclick = saveBlog; 

    alert("Blog updated successfully!");
}

function showFullBlog(blog, index) {
    const savedBlogsContainer = document.getElementById("savedBlogs");
    savedBlogsContainer.innerHTML = `
        <div class="blog-item">
            <img src="${blog.image}" alt="Blog Image" class="blog-full-image" />
            <h4>${blog.title}</h4>
            <p>${blog.content}</p>
            <button onclick="showBlogs()">Back to All Blogs</button>
            <button onclick="editBlog(${index})">Edit</button>
            <button onclick="deleteBlog(${index})">Delete</button>
        </div>
    `;
}