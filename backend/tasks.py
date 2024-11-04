from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, ListItem

tasks = Blueprint('tasks', __name__)



@tasks.route('/create_items', methods=['POST'])
@login_required
def create_item():
    data = request.json
    new_item = ListItem(
        name=data['name'],
        list_id=data['list_id'],
        parent_id=None, 
        task_depth=0
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@tasks.route('/tasks/<int:item_id>/update', methods=['PATCH'])
@login_required
def update_item(item_id):
    item = ListItem.query.get_or_404(item_id)
    if item.list.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 400
    
    
    data = request.json
    item.name = data.get('name', item.name)
    item.completed = data.get('completed', item.completed)
    item.parent_id = data.get('parent_id', item.parent_id)
        
    def parent_completion(item):
        parent = item.parent
        if parent:
            parent.completed = all([child.completed for child in parent.children])
            parent_completion(parent)
        
    
    def parent_not_completed(item):
        parent = item.parent
        if parent:
            parent.completed = False
            parent_not_completed(parent)

    
    if item.completed and item.parent:
        parent_completion(item)

    db.session.commit()
    return jsonify(item.to_dict()), 200

@tasks.route('/tasks/<int:item_id>/delete', methods=['DELETE'])
@login_required
def delete_item(item_id):
    item = ListItem.query.get_or_404(item_id)
    if item.list.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(item)
    db.session.commit()
    return '', 204


@tasks.route('/tasks/<int:item_id>/children', methods=['POST'])
@login_required
def add_children(item_id):
    def check_parent_completed(item):
        parent = item.parent
        if parent:
            parent.completed = False
            check_parent_completed(parent)
    
    item = ListItem.query.get_or_404(item_id)
    if item.list.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    new_item = ListItem(
        name=request.json['name'],
        list_id=item.list_id,
        parent_id=item_id,
        task_depth=item.task_depth + 1
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify([child.to_dict() for child in item.children])

@tasks.route('/tasks/<int:item_id>/move', methods=['PATCH'])
@login_required
def move_item(item_id):
    def check_parent_completion (item):
        parent_item = ListItem.query.get(item.parent_id)
        all_children = True
        for child in parent_item.children:
            if not child.completed and child.id != item.id:
                all_children = False
                break

        if all_children:
            parent_item.completed = True
            check_parent_completion(parent_item)
    
    item = ListItem.query.get_or_404(item_id)

    post_item = request.json
    list_id = post_item.get('list_id')

    if item.list_id != list_id:
        item.list_id = list_id
        item.parent_id = None
        item.task_depth = 0
        db.session.commit()
        return jsonify(item.to_dict()), 200

    


