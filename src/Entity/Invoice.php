<?php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use Doctrine\DBAL\Types\Types;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\InvoiceRepository;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    operations:[new GetCollection(),new Post(),new Get(), new Put(),new Delete(),    new Post(name: 'increment', routeName: 'increment'),],
    paginationEnabled: false,
    order: ['sentAt' => 'DESC'],
    normalizationContext: ['groups' => ['invoices_read']],
    denormalizationContext: ['disable_type_enforcement'=>'true']
)]

#[ApiResource(
    uriTemplate: '/customers/{id}/invoices', 
    uriVariables: [
        'id' => new Link(
            fromClass: Customer::class,
            fromProperty: 'invoices'
        )
    ], 
    operations: [new GetCollection()]
)]
#[ApiFilter(OrderFilter::class)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['invoices_read','customers_read'])]
    #[Assert\NotBlank(message:"Le montant de la facture est obligatoire")]
    #[Assert\Type(type:"numeric" ,message:"Le montant de la facture  doit être numérique")]
    private  $amount = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['invoices_read','customers_read'])]
      // #[Assert\Type(type:"\DateTimeInterface",message:"la date doit être au format YYYY-MM-DD")]
    // #[Assert\DateTime(message:"la date doit être valide")]
    #[Assert\Type(type:"\DateTimeInterface",message:"la date doit être au format YYYY-MM-DD")]
    #[Assert\NotBlank(message:"La date d'envoie doit être renseignée")]
    private ?\DateTimeInterface $sentAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['invoices_read','customers_read'])]
    #[Assert\NotBlank(message:"Le statut de la facture est obligatoire")]
    #[Assert\Choice(choices:["SENT","PAID","CANCELLED"],message:"Le statut doit être SENT , PAID , ou CANCELLED")]
    private ?string $status = null;

        // #[Groups(['invoices_read','customers_read'])]
    #[ORM\ManyToOne(inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['invoices_read','customers_read'])]
    #[Assert\NotBlank(message:"Le client de la facture doit être renseignée")]
    private ?Customer $customer = null;

    #[ORM\Column]
    #[Groups(['invoices_read','customers_read'])]
    #[Assert\NotBlank(message:"Il faut absolument un chrono pour la facture")]
    #[Assert\Type(type:"integer",message:"Le chrono doit être un nombre !")]
    private  $chrono = null;

    #[Groups(['invoices_read'])]
    public function getUser(): User {
        return $this->customer->getUser();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?customer
    {
        return $this->customer;
    }

    public function setCustomer(?customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono( $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
