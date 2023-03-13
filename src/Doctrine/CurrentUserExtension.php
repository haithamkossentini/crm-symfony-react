<?php
namespace App\Doctrine ; 

use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Metadata\Operation;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {

    private $security;
    private $auth;

    public function __construct(Security $security,AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }
    public function addWhere(QueryBuilder $queryBuilder, string $resourceClass) 
    {
        //Obtenir l'utilisateur cconnecté
        $user = $this->security->getUser();
        //si on demande des invoices ou des customers alors, agir sur la requête pour qu'elle tienne compte de l'utilisateur connecté.
        if(($resourceClass=== Customer::class || $resourceClass === Invoice::class )&& !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User){
            $rootAlias = $queryBuilder->getRootAliases()[0];
            if($resourceClass=== Customer::class ){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }else if ($resourceClass=== Invoice::class){
                $queryBuilder->join("$rootAlias.customer","c")
                             ->andWhere("c.user = :user");
                // dd($queryBuilder);
            }
            $queryBuilder->setParameter("user",$user);
        //dd($queryBuilder);
        }
    }
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, 
    string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, 
    string $resourceClass, array $identifiers, ?Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);

    }
}