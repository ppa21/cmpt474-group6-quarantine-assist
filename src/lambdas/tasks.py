import boto3
import datetime
import json
import uuid

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Tasks')
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    if event['httpMethod'] == 'GET':
        if event['pathParameters']:
            # get one item
            item = table.get_item(Key=dict(id=event['pathParameters']['id']))
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
        # create one item
        body = json.loads(event['body'])
        try:
            # get user sub
            if not (
                'authorizer' in event['requestContext'] and
                'claims' in event['requestContext']['authorizer'] and
                'sub' in event['requestContext']['authorizer']['claims']
            ):
                return dict(
                    statusCode=401,
                    headers=headers,
                    body='authorized user'
                )
                
            user_sub = event['requestContext']['authorizer']['claims']['sub']
            item = dict(
                id=str(uuid.uuid4()),
                title=body['title'],
                description=body['description'],
                created_at=now,
                updated_at=now,
                user_id=user_sub
            )
            table.put_item(Item=item)
            return dict(
                statusCode=200,
                headers=headers,
                body=json.dumps(item)
            )

        except KeyError as ex:
            return dict(
                statusCode=400,
                headers=headers,
                body='`title` and `description` are required'
            )
    
    return dict(
        statusCode=200,
        headers=headers,
        body=json.dumps(event)
    )
