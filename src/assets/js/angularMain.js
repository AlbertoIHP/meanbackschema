
//Instancia de angular
var app = angular.module('conectikidslanding',['ngResource']);


//Se crea un controlador con su funcion callback
app.controller('mailingController', [ '$scope', '$resource', '$location', contactForm]);


//Se definen todos aquellos elemtentos que seran utilizados por el nodo del DOM que
//tenga la instancia de este controlador
function contactForm( $scope, $resource, $location )
{
	//Variables iniciales

	$scope.state = { 
		password: '', 
		user: { name: 'hola' }, 
		writeContact: true, 
		sendingInfo: false,
		errorShowed: false, 
		infoSended: false,
		forgotToken: $location.$$absUrl.split('/')[( $location.$$absUrl.split('/').length - 1 )] }



	//Obtenemos la informacion del usuario
	$resource('https://conectikidsback.herokuapp.com/api/password-resets/'+$scope.state.forgotToken, {}, {
		get: 
		{
			method: 'GET'
		}}).get().$promise.then( function(result)
		{
			$scope.state.user = result.user
		}, function(error) 
		{
			$scope.state.errorShowed = true
			$scope.state.writeContact = false
			$scope.state.sendingInfo = false
			$scope.state.infoSended = false
		})




	$scope.enviarInfo = function()
	{

		console.log( $scope.state.password )

		if( $scope.state.password != '' )
		{
			$scope.state.sendingInfo = true
			$scope.state.writeContact = false
			$scope.state.sendingInfo = false
			$scope.state.infoSended = false
			console.log("AQUI DEBE IR EL FETCH")
			$scope.updatePass()
		}
		else
		{

			alert("Ingrese su nueva contraseña")
		}
		
	}

	$scope.updatePass = function( )
	{
		var contentType = 'application/json'

		var fetch = $resource('https://conectikidsback.herokuapp.com/api/password-resets/'+$scope.state.forgotToken, {}, {
			put:
			{
				method: 'PUT',
				headers:
				{
					'Content-Type' : contentType
				}
			}
		})


		var peticion = fetch.put( { password: $scope.state.password} )

		peticion.$promise.then( function ( result )
		{
			console.log( result )			
			$scope.state.errorShowed = false
			$scope.state.writeContact = false
			$scope.state.sendingInfo = false
			$scope.state.infoSended = true

		}, function ( error )
		{
			console.log(error)
			$scope.state.errorShowed = true
			$scope.state.writeContact = false
			$scope.state.sendingInfo = false
			$scope.state.infoSended = false

		})
	}

}



