from flask import Flask

app = Flask(__name__)


@app.route("/projects", methods=["GET"])
def list_projects():
    pass


@app.route("/projects/<project_id>", methods=["GET"])
def describe_project():
    pass


@app.route("/projects", methods=["POST"])
def create_project():
    pass


@app.route("/projects/<project_id>", methods=["PUT"])
def update_project():
    pass


@app.route("/projects/<project_id>", methods=["DELETE"])
def delete_project():
    pass
