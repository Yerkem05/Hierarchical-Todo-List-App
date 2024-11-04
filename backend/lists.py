from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import List, db 

bp_list = Blueprint('lists', __name__)

# Helper functions
@bp_list.route('/lists', methods=['GET'])
@login_required
def get_user_lists():
    """Retrieve all lists for the current user."""
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401
    return List.query.filter_by(user_id=current_user.id).all()

    
@bp_list.route('/list/create', methods=['POST'])
@login_required
def create_new_list(name):
    """Create a new list for the current user."""
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401
    try: 
        new_list = List(name=name, user_id=current_user.id, tasks=[])
        db.session.add(new_list)
        db.session.commit()
        return new_list
    
    except Exception as e:
        return jsonify({'error': 'An error occurred while creating the list'}), 400


@bp_list.route('/delete_list/<list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    """Endpoint to delete a list and its associated tasks."""
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401
    lst = List.query.get_or_404(list_id)

       # Check if the current user owns the list
    if lst.owner != current_user:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if lst.tasks:
        for task in lst.tasks:
            db.session.delete(task)
    
    db.session.delete(lst)
    db.session.commit()
    return jsonify({'message': 'List and its tasks deleted successfully'}), 204

    
    
@bp_list.route('/list/update', methods=['PATCH'])
@login_required
def update_list(list_id):
    """Endpoint to update a list's name."""
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401
    new_name = request.json.get('name')
    if not new_name:
        return jsonify({'error': 'Name is required'}), 400
    
    lst = List.query.get_or_404(list_id)
    lst.name = new_name
    db.session.commit()
    
    return jsonify({'id': lst.id, 'name': lst.name}), 200

