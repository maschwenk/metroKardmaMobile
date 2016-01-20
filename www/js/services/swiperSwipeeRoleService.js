angular.module('starter.services').factory('SwiperSwipeeRoleService', function() {
   var o = {
   };

   o.getCurrentRole = getCurrentRole;
   o.setCurrentRole = setCurrentRole;
   o.isSwiper = isSwiper;
   o.isSwipee = isSwipee;
   o.toggleRole = toggleRole;
   return o;

   function getCurrentRole(){
     return o.currentRole;
   }

   function isSwiper(){
     return o.currentRole === 'swiper';
   }

   function isSwipee(){
     return o.currentRole === 'swipee';
   }

   function setCurrentRole(role){
     if (role === 'swipee' || role === 'swiper'){
       o.currentRole = role;
     }
     // throw new Exception("Role is incorrectly specified");
   }

   function toggleRole(){
     if ( o.getCurrentRole() === 'swipee' ) {
       o.currentRole = 'swiper';
     }
     else{
       o.currentRole = 'swipee';
     }
     return o.currentRole;
   }
 })