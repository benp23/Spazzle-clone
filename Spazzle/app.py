from flask import Flask, render_template, url_for
app = Flask(__name__)

posts = [
    {
        'author': 'spencer wheeler',
        'title': 'Flask Practice',
        'content': 'pracice',
        'date_posted': 'Apr, 4'
    },
    {
        'author': 'spencer wheeler',
        'title': 'Flask Practice',
        'content': 'pracice second',
        'date_posted': 'Apr, 5'
    }
]

@app.route('/')
@app.route('/home')
@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/sort')
def sort():
    return render_template('sort.html')

@app.route('/game')
def game():
    return render_template('game_template.html')
    
@app.route('/memory/color')
def color_memory():
    return render_template('color_memory.html')
    
@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/addition/base')
def addition():
    return render_template('addition.html')

@app.route('/addition/animated')
def addition_animated():
    return render_template('addition_animated.html')
    
if __name__ == '__main__':
    app.run(port = 5000, debug = True)