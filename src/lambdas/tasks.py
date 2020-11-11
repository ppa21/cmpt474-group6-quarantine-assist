import boto3
import datetime
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Tasks')
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    if event['httpMethod'] == 'POST':
        body = json.loads(event['body'])
        try:
            item = dict(
                title=body['title'],
                description=body['description']
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
