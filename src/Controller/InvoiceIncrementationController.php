<?php 

namespace App\Controller; 

use App\Entity\Invoice;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementationController extends AbstractController{
    private $manager;
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }
    #[Route(name:'increment',path:'/api/invoices/{id}/increment')]
    public function __invoke(Invoice $data)
    {   
        $data->setChrono($data->getChrono() + 1);
        $this->manager->flush();
        dd($data);
    }
}