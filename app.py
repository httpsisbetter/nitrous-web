from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

GITHUB_API_BASE_URL = "https://api.github.com"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/lookup', methods=['GET'])
def lookup():
    email = request.args.get('email')
    response = requests.get(f'https://api.nitrous-oxi.de/email?query={email}')
    data = response.json()

    results = {}
    for service in data:
        service_data = service.get('data', {})
        if isinstance(service_data, dict) and service_data.get('status') == 200:
            if service['name'] == 'github':
                github_username = service_data['data']['items'][0]['login']
                results['github'] = fetch_github_profile(github_username)
            else:
                profile_data = service_data['data']
                link = profile_data.get('url', '') if isinstance(profile_data, dict) else ''
                results[service['name']] = {
                    'profile': profile_data,
                    'link': link
                }
        else:
            results[service['name']] = {
                'status': service_data.get('status', 'unknown'),
                'data': service_data.get('data', None)
            }

    return jsonify(results)


def fetch_github_profile(username):
    profile_url = f"{GITHUB_API_BASE_URL}/users/{username}"
    repos_url = f"{GITHUB_API_BASE_URL}/users/{username}/repos"
    contributions_url = f"https://github-contributions-api.now.sh/v1/{username}"

    profile_response = requests.get(profile_url)
    repos_response = requests.get(repos_url)
    contributions_response = requests.get(contributions_url)

    profile_data = profile_response.json()
    try:
        repos_data = repos_response.json()
    except ValueError:
        repos_data = []
    try:
        contributions_data = contributions_response.json()
    except ValueError:
        contributions_data = {"years": []}

    # Debugging information
    print(f"Profile Data: {profile_data}")
    print(f"Repos Data: {repos_data}")
    print(f"Contributions Data: {contributions_data}")

    profile = {
        'username': profile_data.get('login', ''),
        'name': profile_data.get('name', ''),
        'location': profile_data.get('location', ''),
        'email': profile_data.get('email', ''),
        'profile_picture': profile_data.get('avatar_url', ''),
        'bio': profile_data.get('bio', ''),
        'blog': profile_data.get('blog', ''),
        'company': profile_data.get('company', ''),
        'created_at': profile_data.get('created_at', ''),
        'followers': profile_data.get('followers', 0),
        'following': profile_data.get('following', 0),
        'public_repos': profile_data.get('public_repos', 0),
        'public_gists': profile_data.get('public_gists', 0),
        'socials': {
            'twitter': profile_data.get('twitter_username', '')
        },
        'repos': [repo.get('name', '') for repo in repos_data if isinstance(repo, dict)],
        'contributions': contributions_data.get('years', []),
        'link': f"https://github.com/{username}"
    }

    return profile


if __name__ == '__main__':
    app.run(debug=True)
