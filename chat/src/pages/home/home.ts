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
    this.commentToAdd = '';
  }

  ngOnInit(){
    this.login();
  }

  login(){
    this.stitchClientPromise.then(stitchClient => {
      stitchClient.login();
      console.log('logged in as: ' + stitchClient.authedId());
      this.stitchClient = stitchClient;
      this.displayComments();
    })
    .catch(e => console.log('error: ', e));
  }

  displayComments(){
    this.msgs = [];

    this.stitchClient.executeFunction("loadAllComments")
    .then((documents) => {
        documents.forEach((document) => this.msgs.push(document.comment));
    });   
  }

  addComment(){
    let db = this.stitchClient.service('mongodb', 'mongodb-atlas').db('blog');
    let itemsCollection = db.collection('comments');
    
    // CRUD operations:
    const userId = this.stitchClient.authedId();
    return itemsCollection.insertOne(
      {userName: userId, comment: this.commentToAdd}
    ).then(this.commentToAdd = '')
    .then(this.displayComments());   
  }

}
