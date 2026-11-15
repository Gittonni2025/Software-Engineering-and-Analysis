// ================= MOBILE MENU TOGGLE =================
const mobileMenuBtn = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

if (mobileMenuBtn && navbar) {
    mobileMenuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        mobileMenuBtn.classList.toggle('is-active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            mobileMenuBtn.classList.remove('is-active');
        });
    });
}


// ================= FAQ ACCORDION TOGGLE =================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('h3');
    
    if (question) {
        question.style.cursor = 'pointer';

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    }
});


// ================= CONSULTATION FORM TO GOOGLE SHEET =================
const consultationForm = document.querySelector('.consultation-form');
const consultationScriptURL = 'https://script.google.com/macros/s/AKfycbyI3uEhjKNViPbht4ebZFc15GBetmchK4KNkp8Jr7YU-9hztEK323pohd-uB261GVc/exec'; 

if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerText = 'Submitting...';
            submitBtn.disabled = true;
        }

        const formData = new FormData(consultationForm);
        const encodedData = new URLSearchParams(formData).toString();

        fetch(consultationScriptURL, { 
            method: 'POST', 
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodedData
        })
        .then(() => {
            alert('ধন্যবাদ! আপনার রিকোয়েস্ট সফলভাবে জমা হয়েছে। Euro Bangla Global Ltd-এর টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
            consultationForm.reset();
            
            if (submitBtn) {
                submitBtn.innerText = 'Submit Request →';
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            alert('দুঃখিত, কোনো সমস্যা হয়েছে! পুনরায় চেষ্টা করুন।');
            
            if (submitBtn) {
                submitBtn.innerText = 'Submit Request →';
                submitBtn.disabled = false;
            }
        });
    });
}


// ================= APPLICANT DOCUMENT TRACKER =================
const trackerForm = document.getElementById('trackerForm');
const trackerScriptURL = 'https://script.google.com/macros/s/AKfycbzY3yvXezfeX6kOmikUat5JzdCOhRpGn9cKFW6QD9-i9D80R04vtuoFaTr9bChv299kLA/exec';
if (trackerForm) {
    trackerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = document.getElementById('trackPhone').value.trim();
        const trackBtn = document.getElementById('trackBtn');
        const resultDiv = document.getElementById('trackerResult');
        const docContainer = document.getElementById('docListContainer');
        
        trackBtn.innerText = 'Checking...';
        trackBtn.disabled = true;

        fetch(`${trackerScriptURL}?phone=${encodeURIComponent(phone)}`)
        .then(res => res.json())
        .then(data => {
            trackBtn.innerText = 'Track Progress →';
            trackBtn.disabled = false;

            if (data.found) {
                resultDiv.style.display = 'block';
                document.getElementById('resName').innerText = data.name;
                document.getElementById('resService').innerText = data.service;
                
                docContainer.innerHTML = '';
                
                // প্রতিটি ডকুমেন্টের ওপর লুপ চালিয়ে চেক করা "Done" আছে কিনা
                for (const [docName, statusVal] of Object.entries(data.documents)) {
                    const isDone = String(statusVal).trim().toLowerCase() === 'done';
                    
                    const docRow = document.createElement('div');
                    docRow.className = 'doc-item';
                    docRow.innerHTML = `
                        <div class="doc-info">
                            <span class="status-light ${isDone ? 'approved' : 'pending'}"></span>
                            <span>${docName}</span>
                        </div>
                        <span class="status-text ${isDone ? 'approved' : 'pending'}">
                            ${isDone ? '✓ Verified' : '⏳ Pending'}
                        </span>
                    `;
                    docContainer.appendChild(docRow);
                }
            } else {
                resultDiv.style.display = 'block';
                docContainer.innerHTML = '<p style="color:red; text-align:center;">No application record found with this phone number.</p>';
                document.getElementById('resName').innerText = 'N/A';
                document.getElementById('resService').innerText = 'N/A';
            }
        })
        .catch(err => {
            alert('Something went wrong. Please try again.');
            trackBtn.innerText = 'Track Progress →';
            trackBtn.disabled = false;
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // Element Selectors
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');

    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');

    // ১. Login বাটনে ক্লিক করলে পপআপ মডাল ওপেন হবে
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (authModal) {
                authModal.style.display = 'flex';
            }
        });
    }

    // ২. ক্রস (X) আইকনে ক্লিক করলে মডাল বন্ধ হবে
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }

    // ৩. মডালের বাইরে ফাঁকা জায়গায় ক্লিক করলেও বন্ধ হবে
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // ৪. Login এবং Register ফর্মের মধ্যে সুইচ করা
    if (showRegisterLink && showLoginLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        });

        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    // ৫. Login ফর্ম সাবমিট (লোকাল টেস্ট)
    const portalLoginForm = document.getElementById('portalLoginForm');
    if (portalLoginForm) {
        portalLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value;
            
            // মডাল বন্ধ করে ড্যাশবোর্ড ওপেন করা
            authModal.style.display = 'none';
            portalLoginForm.reset();

            // ড্যাশবোর্ডে ডেটা বসানো
            document.getElementById('dashStudentName').innerText = "Valued User";
            document.getElementById('dashRoleTitle').innerText = "Student";
            document.getElementById('dashStudentPhone').innerText = phone;
            document.getElementById('dashStudentEmail').innerText = "user@gmail.com";
            
            document.getElementById('studentDashboard').style.display = 'block';
            alert("Successfully Logged In!");
        });
    }

    // ৬. Register ফর্ম সাবমিট (লোকাল টেস্ট)
    const portalRegisterForm = document.getElementById('portalRegisterForm');
    if (portalRegisterForm) {
        portalRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Registration Successful! Please login now.");
            portalRegisterForm.reset();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    // ৭. Logout বাটন
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            document.getElementById('studentDashboard').style.display = 'none';
            alert("Logged out successfully!");
        });
    }
});