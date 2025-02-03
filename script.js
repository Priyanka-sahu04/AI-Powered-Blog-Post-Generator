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
        prompt: `content:\n\n${blogContent}`,
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
        alert("Please enter your image address.");
        return;
    }

    const newBlog = {
        title: selectedTitle,
        content: blogContent,
        image: blogImage
    };
    blogs.unshift(newBlog);

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
        alert("Please enter your image address.");
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
            <button onclick="showBlogs()" class="back-button">Back to All</button></br>
            <button onclick="editBlog(${index})">Edit</button>
            <button onclick="deleteBlog(${index})">Delete</button>
        </div>
    `;
}

const hardCodedBlog = [
    {
        title: "The Joy of Gardening: A Step Towards a Greener Life",
        img: "https://quaintnook.com/wp-content/uploads/2023/12/IMG_4447.jpeg",
        content: "Gardening is more than just a hobby; it’s a way to connect with nature and create a peaceful environment. Whether you have a small balcony or a big backyard, growing plants brings joy and relaxation. Beyond aesthetics, gardening also promotes sustainability. Growing your own herbs and vegetables reduces dependency on store-bought produce, ensuring fresh, chemical-free food for your family. Additionally, composting kitchen waste and using organic fertilizers contribute to a healthier ecosystem. So, grab a pot, plant a seed, and watch nature bloom in your own space! Gardening is a simple yet fulfilling way to embrace a greener and healthier lifestyle."
    },
    {
        title: "Absolutely! Here is a slightly longer version of the",
        img: "https://sukhis.com/app/uploads/2022/09/image3-5-900x601-1.jpg",
        content: "Most of the rich, buttery Indian dishes popular in the US, such as crispy naan, creamy butter chicken, and toasty samosas, originate from the Punjab region in northern India. While these dishes are undoubtedly delicious, they only represent a fraction of what India has to offer. In contrast to wheat-based North Indian food, South Indian food dishes are generally lighter and revolve around a rice-based diet. South India is home to many of the world’s most coveted ingredients like curry leaves, peppercorns, tamarind, coconut, and chilies. Many dishes feature over a dozen different spices, allowing the spices to mingle and marry to create vibrant fireworks of flavor."
    },
    {
        title: "April’s Awakening: Embracing Renewal and Blossoming Beauty",
        img: "https://jasonlouro.ghost.io/content/images/2023/06/Seasons.webp",
        content: "As we pull on our raincoats yet again and wait for the warmth of spring to emerge, April brings the blustery winds of renewal and a welcome sense of new beginnings. From the swaying tulips splashing colour across waterlogged gardens to the welcome return of migrating birds and softly blossoming hedgerows, there is much beauty to embrace and plenty of small wonders to appreciate this month. Opening up our lives to change, the name of the month, April, is believed to come from the Latin word “aprilis,” which means “to open” or “to blossom.” The buds begin to bloom and nature comes to life again after the cold winter months."
    },
    {
        title: "That's a great mission statement! It sounds like",
        img: "https://www.tandfonline.com/cms/asset/2390eff2-ed75-43b3-8e01-11ac0c67530b/uced_a_2083384_uf0010_c.jpg",
        content: "We strive to connect students with a God who loves them no matter what. We encourage students to grow in authentic relationships with peers and leaders who can help them navigate the challenges of growing into adulthood. And we provide opportunities for students to see the power they have to serve and radically impact their individual communities."
    },
    {
        title: "Request for Care",
        img: "https://www.harwoodhouse.co.uk/wordpress/wp-content/uploads/End-of-Life-Care-2000x1200-1.jpg",
        content: "We are passionate about connecting people with God through authentic relationships to serve communities. We are a church that cares deeply for the needs of God's people. One of the ways in which we accomplish this is through our Care Team. Our Care Team is here to walk alongside you, providing spiritual and emotional support in your time of need."
    }
];

// Open Lightbox
function openLightbox(index) {
    document.getElementById("lightbox").style.display = "flex";
    document.getElementById("lightbox-title").innerText = hardCodedBlog[index].title;
    document.getElementById("lightbox-img").src = hardCodedBlog[index].img;
    document.getElementById("lightbox-content").innerText = hardCodedBlog[index].content;
}

// Close Lightbox
function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}