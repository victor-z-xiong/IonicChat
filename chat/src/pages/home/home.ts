import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StitchClientFactory } from 'mongodb-stitch';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  appId: any;
  stitchClientPromise: any;
  msgs: any;
  commentToAdd: any;
  stitchClient: any;

  constructor(public navCtrl: NavController) {
    this.appId = 'testapplication-iuxfo';
    this.stitchClientPromise = StitchClientFactory.create(this.appId);
    this.msgs = [];
    this.commentToAdd = '';
  }

  ngOnInit(){
    //this.displayComments();
    this.login();
  }

  login(){
    this.stitchClientPromise.then(stitchClient => {
      stitchClient.login();
      console.log('logged in as: ' + stitchClient.authedId());
      this.stitchClient = stitchClient;
    })
    .catch(e => console.log('error: ', e));
  }

  displayComments(){
    let db = this.stitchClient.service('mongodb', 'mongodb-atlas').db('blog');
    let itemsCollection = db.collection('comments');
    
    itemsCollection.find({}, {limit: 1000})
    .asArray()
    .then(docs => {
      this.msgs = docs.map(doc => doc.comment);
    });     
  }

  addComment(){
    let db = this.stitchClient.service('mongodb', 'mongodb-atlas').db('blog');
    let itemsCollection = db.collection('comments');
    
    // CRUD operations:
    const userId = this.stitchClient.authedId();
    return itemsCollection.insertOne(
      {userName: userId, comment: this.commentToAdd}
    ).then(this.commentToAdd = '');   
  }

}
