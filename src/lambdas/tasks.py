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
    cognito = boto3.client('cognito-idp')
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-control'
    }
    
    if event['httpMethod'] == 'GET':
        if event['pathParameters']:
            if not is_user_sub_present:
                return dict(
                    statusCode=401,
                    headers=headers,
                    body='unauthorized user'
                )

            # get one item
            item = table.get_item(
                Key={
                    'id': event['pathParameters']['id']
                }
            )
            
            user_pool_id = event['requestContext']['authorizer']['claims']['iss'].split('/')[-1]
            current_user_sub = event['requestContext']['authorizer']['claims']['sub']
            task_user_sub = item['Item']['user_id']
            response = cognito.list_users(
                UserPoolId=user_pool_id,
                Filter='sub = "' + task_user_sub + '"',
            )

            #TODO also get the volunteer user by volunteer_id if one exists
 
            task_user = response['Users'][0]
            user = {
                'username': task_user['Username']
            }
            if task_user_sub == current_user_sub: #TODO add OR if the current_use_sub is the same as volunteer_id if one exists
                user['email'] = [a for a in task_user['Attributes'] if a['Name'] == 'email'][0]['Value']
                #TODO add user[volunteer_email] if a volunteer exists

            for attribute in task_user['Attributes']:
                if attribute['Name'] in ('nickname', 'given_name', 'family_name'):
                    user[attribute['Name']] = attribute['Value']
                
            
            item['Item']['user'] = user
            item['Item']['requestContext'] = event['requestContext']

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
