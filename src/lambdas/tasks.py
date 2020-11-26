import boto3
import datetime
import json
import uuid

def is_user_sub_present(event):
    return (
        'authorizer' in event['requestContext'] and
        'claims' in event['requestContext']['authorizer'] and
        'sub' in event['requestContext']['authorizer']['claims']
    )

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Tasks')
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-control'
    }
    
    if event['httpMethod'] == 'GET':
        if event['pathParameters']:
            # get one item
            item = table.get_item(
                Key={
                    'id': event['pathParameters']['id']
                }
            )
            return dict(
                statusCode=200,
                headers=headers,
                body=json.dumps(item['Item'])
            )
        
        else:
            # get all items
            items = table.scan()
            return dict(
                statusCode=200,
                headers=headers,
                body=json.dumps(items['Items'])
            )
    
    elif event['httpMethod'] == 'POST':
        if not is_user_sub_present:
            return dict(
                statusCode=401,
                headers=headers,
                body='unauthorized user'
            )

        try: 
            body = json.loads(event['body'])
            user_sub = event['requestContext']['authorizer']['claims']['sub']
            item = dict(
                id=str(uuid.uuid4()),
                title=body['title'],
                description=body['description'],
                created_at=now,
                updated_at=now,
                user_id=user_sub,
                status=body['status']
            )
            # create one item
            table.put_item(Item=item)
            return dict(
                statusCode=201,
                headers=headers,
                body=json.dumps(item)
            )

        except KeyError as ex:
            return dict(
                statusCode=400,
                headers=headers,
                body='`title` and `description` are required'
            )

    elif event['httpMethod'] == 'PUT' and event['resource'] == "/task/{id}/volunteer":
        if not is_user_sub_present:
            return dict(
                statusCode=401,
                headers=headers,
                body='unauthorized user'
            )

        user_sub = event['requestContext']['authorizer']['claims']['sub']
        help_offered = 'Help Offered'
        
        try:
            body = json.loads(event['body'])
            table.update_item(
                Key={
                    'id': event['pathParameters']['id']
                },
                UpdateExpression='set volunteer_id = :user_sub, updated_at = :now, #S = :new_status', 
                # ConditionExpression='#S = :open_status',
                ExpressionAttributeNames={
                    '#S': 'status'
                },
                ExpressionAttributeValues={
                    ':now': now,
                    ':user_sub': user_sub,
                    ':new_status': body['status'],
                }
            )
        except Exception as e:
            return dict(
                statusCode=401,
                headers=headers,
                body="Invalid status"
            )
    
    elif event['httpMethod'] == 'PUT' and event['pathParameters']:
        if not is_user_sub_present:
            return dict(
                statusCode=401,
                headers=headers,
                body='unauthorized user'
            )
        
        # only update item if user sub matches task's user id
        body = json.loads(event['body'])
        user_sub = event['requestContext']['authorizer']['claims']['sub']
        table.update_item(
            Key={
                'id': event['pathParameters']['id']
            },
            UpdateExpression='set description = :description, updated_at = :now',
            ConditionExpression='user_id = :user_sub',
            ExpressionAttributeValues={
                ':description': body['description'],
                ':now': now,
                ':user_sub': user_sub
            }
        )
        return dict(
            statusCode=200,
            headers=headers
        )

    
    elif event['httpMethod'] == 'DELETE' and event['pathParameters']:
        if not is_user_sub_present:
            return dict(
                statusCode=401,
                headers=headers,
                body='unauthorized user'
            )
        
        # only delete item if user sub matches task's user id
        user_sub = event['requestContext']['authorizer']['claims']['sub']
        table.delete_item(
            Key={
                'id': event['pathParameters']['id']
            },
            ConditionExpression='user_id = :user_sub',
            ExpressionAttributeValues={
                ':user_sub': user_sub
            }
        )
        return dict(
            statusCode=200,
            headers=headers
        )
    
    return dict(
        statusCode=200,
        headers=headers,
        body=json.dumps(event)
    )