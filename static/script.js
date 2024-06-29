function performLookup() {
    const email = document.getElementById('email').value;
    fetch(`/lookup?email=${email}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            let htmlContent = '<h2>Results:</h2>';

            if (data.github && data.github.status !== 404) {
                const github = data.github;
                htmlContent += `
                    <h3>GitHub:</h3>
                    <p><strong>Profile Picture:</strong><br><img src="${github.profile_picture}" alt="Profile Picture" width="100" height="100"></p>
                    <p><strong>Username:</strong> ${github.username}</p>
                    <p><strong>Name:</strong> ${github.name}</p>
                    <p><strong>Location:</strong> ${github.location}</p>
                    <p><strong>Email:</strong> ${github.email}</p>
                    <p><strong>Bio:</strong> ${github.bio}</p>
                    <p><strong>Blog:</strong> ${github.blog}</p>
                    <p><strong>Company:</strong> ${github.company}</p>
                    <p><strong>Created At:</strong> ${github.created_at}</p>
                    <p><strong>Followers:</strong> ${github.followers}</p>
                    <p><strong>Following:</strong> ${github.following}</p>
                    <p><strong>Public Repos:</strong> ${github.public_repos}</p>
                    <p><strong>Public Gists:</strong> ${github.public_gists}</p>
                    <p><strong>Repos:</strong> ${github.repos.join(', ')}</p>
                    <p><strong>Contributions:</strong> ${github.contributions.map(year => `Year: ${year.year}, Total: ${year.total}`).join(', ')}</p>
                    <p><strong>Socials:</strong> ${github.socials.twitter ? `Twitter: <a href="https://twitter.com/${github.socials.twitter}" target="_blank">${github.socials.twitter}</a>` : 'N/A'}</p>
                    <p><strong>Profile Link:</strong> <a href="${github.link}" target="_blank">${github.link}</a></p>
                `;
            }

            const services = ['duolingo', 'google', 'hulu', 'imgur', 'mewe', 'snapchat', 'snusbasePasswords', 'spotify', 'twitter', 'wordpress'];
            services.forEach(service => {
                if (data[service] && data[service].status !== 404) {
                    htmlContent += `<h3>${service.charAt(0).toUpperCase() + service.slice(1)}:</h3>
                                    <p><strong>Profile Link:</strong> <a href="${data[service].link}" target="_blank">${data[service].link}</a></p>
                                    <p><strong>Data:</strong> ${JSON.stringify(data[service].profile)}</p>`;
                } else {
                    htmlContent += `<h3>${service.charAt(0).toUpperCase() + service.slice(1)}:</h3>
                                    <p>No data found</p>`;
                }
            });

            resultsDiv.innerHTML = htmlContent;
            window.scrollTo(0, resultsDiv.offsetTop);
        })
        .catch(error => console.error('Error:', error));
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
