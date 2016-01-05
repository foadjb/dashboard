app.controller('indexController',
	['$scope','$rootScope','userService','$location','notificationService','projectService','$sce',
	function($scope,$rootScope,userService,$location,notificationService,projectService,$sce){	

    $scope.acceptInvitationSpinner=[];
    $scope.declineInvitationSpinner=[];
    $scope.notifySpinner=false;
    $scope.notificationsSkip=0;
    $scope.notificationsLimit=5;

    getUserInfo();

    $scope.$watch(function(scope) {
      return $location.path();
    },function(newPath,oldPath) {
        if(!$.cookie('userId') || $.cookie('userId')=="null" || $.cookie('userId')=="undefined"){          
          window.location.href="/accounts";
        }else{
          $rootScope.userFullname=$.cookie('userFullname'); 
        }            
    });  

    $rootScope.logOut=function(){
      userService.logOut()      
      .then(function(data){           

        $.removeCookie('userId', { path: '/' });
        $.removeCookie('userFullname', { path: '/' });
        $.removeCookie('email', { path: '/' });
        $.removeCookie('createdAt', { path: '/' });

        window.location.href="/accounts";
      },function(error){
           console.log(error);
      });      
    }; 

    //Private Functions
  function getUserInfo(){  
    $scope.notifySpinner=true;  
    userService.getUserInfo()
    .then(function(obj){ 
      if(obj && obj.user){
        $rootScope.user=obj.user; 
        getNotifications();           
      }else{
        $scope.notifySpinner=false;
      }         
      if(obj && obj.file){
        getImgSize(obj.file.document.url);      
        $rootScope.profilePic=obj.file; 
      }else{
        $rootScope.profilePic=null; 
      }      
    }, function(error){ 
      $scope.notifySpinner=false;        
    });
  }  

  function getImgSize(imgSrc) {
      var newImg = new Image();

      newImg.onload = function() {
        var height = newImg.height;
        var width = newImg.width;
        
        if(width>height){
          $(".profile-avatar").css({"width":"auto","height":"28px"});
        }else if(height>width){
          $(".profile-avatar").css({"width":"28px","height":"auto"});
        }        
      }

      newImg.src = imgSrc; // this must be done AFTER setting onload
  }

  function getNotifications(){    
    notificationService.getNotifications($scope.notificationsSkip,$scope.notificationsLimit) 
    .then(function(list){ 
      $rootScope.notifications=list;
      $scope.notifySpinner=false;
    }, function(error){   
      $scope.notifySpinner=false;      
    });
  }

  $scope.loadMoreNotifications=function(){    
    $scope.loadingMoreNotifications=true;
    notificationService.getNotifications($scope.notificationsLimit,5)
    .then(function(notifyList){ 
      if(notifyList && notifyList.length>0){
        $scope.notificationsLimit=$scope.notificationsLimit+notifyList.length;

        if($rootScope.notifications.length>0){
          $rootScope.notifications = $rootScope.notifications.concat(notifyList);           
        }else{
          $rootScope.notifications=notifyList;
        }        
      }  
      $scope.loadingMoreNotifications=false;   
    },function(error){      
      $scope.loadingMoreNotifications=false;              
    });
  };

  $scope.toggleSideMenu=function(){     
    /*Collapse sidebar*/
    toggleSideBar();         
  }; 

  $scope.updateNotificationsSeen=function(){
    notificationService.updateNotificationsSeen()
    .then(function(list){    
    }, function(error){         
    });
  };

  $scope.addDeveloper=function(index,notifyObject) {
    $scope.acceptInvitationSpinner[index]=true;
    projectService.addDeveloper(notifyObject.appId,$rootScope.user.email)
    .then(function(project){ 
      var notificationIndex=$rootScope.notifications.indexOf(notifyObject);
      $rootScope.notifications.splice(notificationIndex,1);

      if($rootScope.notifications.length==0){
        $(".notify-menu-anchor").click();
      }

      if(project && project.appId){
        $rootScope.$broadcast('addApp', { app:project});
      }    
      $scope.acceptInvitationSpinner[index]=false; 

    }, function(error){  
      if($rootScope.notifications.length==0){
        $(".notify-menu-anchor").click();
      }
      $scope.acceptInvitationSpinner[index]=false;              
    });

  };

  $scope.removeUserFromInvited=function(index,notifyObject){  
    $scope.declineInvitationSpinner[index]=true;  
    projectService.removeUserFromInvited(notifyObject.appId,$rootScope.user.email)
    .then(function(data){ 
      var notificationIndex=$rootScope.notifications.indexOf(notifyObject);
      $rootScope.notifications.splice(notificationIndex,1); 
      if($rootScope.notifications.length==0){
        $(".notify-menu-anchor").click();
      }  
      $scope.declineInvitationSpinner[index]=false;                        
    },function(error){ 
      console.log(error); 
      $scope.declineInvitationSpinner[index]=false;                        
    });
  };

  $scope.renderHtml = function (htmlCode) {
    return $sce.trustAsHtml(htmlCode);
  };

  function toggleSideBar(_this){
    var b = $("#sidebar-collapse")[0];
    var w = $("#cl-wrapper");
    var s = $(".cl-sidebar");
   
    $(".fa",b).removeClass("fa-angle-left").addClass("fa-angle-right");
    w.addClass("sb-collapsed");
    $.cookie('FLATDREAM_sidebar','closed',{expires:365, path:'/'});         
    //updateHeight();
  } 
      				
		
}]);
