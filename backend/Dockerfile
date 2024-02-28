FROM python:3.11.5
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /bob2
WORKDIR /bob2
RUN pip install pip -U
RUN pip install gunicorn
COPY requirements.txt /bob2/
COPY hello_bitcoin_contract_abi.json /bob2/
RUN pip install -r requirements.txt
COPY . /bob2/
EXPOSE 8002
# RUN python manage.py collectstatic --no-input --clear
